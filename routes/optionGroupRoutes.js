const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/option-groups
router.get("/", authMiddleware, async (req, res) => {
  let { outlet_id } = req.query;
  const ownerId = req.user.bizId || req.user.id;
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  try {
    // 1. Fetch Option Groups
    const query = `
      SELECT id, name, min_selectable, max_selectable, 
             (max_selectable > 1) as is_multiple, 
             is_addon as is_chargeable, 
             is_active, sorting_order 
      FROM option_groups 
      WHERE user_id = $1 
      ${outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined' ? `AND (outlet_id = $2 OR outlet_id IS NULL)` : ''}
      ORDER BY sorting_order ASC, id DESC
    `;
    const params = [ownerId];
    if (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') params.push(outlet_id);
    
    const result = await pool.query(query, params);
    const groups = result.rows;

    // 2. Fetch linked data for each group
    for (let group of groups) {
      // 1. Fetch main items for this group to get menu context
      let mainItems = [];
      const linkedRes = await pool.query(
        `SELECT iog.item_id, omi.id as menu_item_id, omi.item_name, omi.menu_id, omi.base_price
         FROM item_option_groups iog
         JOIN outlet_menu_items omi ON omi.id = iog.item_id
         WHERE iog.group_id = $1`,
        [group.id]
      );

      if (linkedRes.rows.length > 0) {
        mainItems = linkedRes.rows;
      } else {
        const nameMatchRes = await pool.query(
          `SELECT id as menu_item_id, item_name, menu_id, base_price
           FROM outlet_menu_items
           WHERE item_name ILIKE $1
           ORDER BY id DESC`,
          [group.name]
        );
        mainItems = nameMatchRes.rows;
      }

      // 2. Fetch options list
      const optionsRes = await pool.query(
        "SELECT id, name, price_override, is_active, sorting_order FROM options_list WHERE group_id = $1 ORDER BY sorting_order ASC",
        [group.id]
      );

      for (let opt of optionsRes.rows) {
        if (parseFloat(opt.price_override || 0) === 0) {
          let resolvedPrice = 0;

          for (let mItem of mainItems) {
            const matchAfter = await pool.query(
              `SELECT base_price
               FROM outlet_menu_items
               WHERE menu_id = $1
                 AND item_name ILIKE $2
                 AND id >= $3
                 AND COALESCE(NULLIF(base_price::text, ''), '0')::numeric > 0
               ORDER BY id ASC
               LIMIT 1`,
              [mItem.menu_id, opt.name, mItem.menu_item_id]
            ).catch(() => null);

            if (matchAfter && matchAfter.rows.length > 0) {
              resolvedPrice = parseFloat(matchAfter.rows[0].base_price);
              break;
            }
          }

          if (resolvedPrice === 0) {
            const matchGlobal = await pool.query(
              `SELECT base_price
               FROM outlet_menu_items
               WHERE item_name ILIKE $1
                 AND COALESCE(NULLIF(base_price::text, ''), '0')::numeric > 0
               ORDER BY (CASE WHEN menu_id = 34 THEN 1 ELSE 2 END), id ASC
               LIMIT 1`,
              [opt.name]
            ).catch(() => null);

            if (matchGlobal && matchGlobal.rows.length > 0) {
              resolvedPrice = parseFloat(matchGlobal.rows[0].base_price);
            }
          }

          if (resolvedPrice > 0) {
            opt.price_override = resolvedPrice;
          }
        }
      }
      group.associated_options = optionsRes.rows;

      // Fetch linked main items (from item_option_groups)
      // FIX: Added menu_id and category_id to help frontend reload data on edit
      const itemsRes = await pool.query(
        `SELECT iog.item_id, omi.item_name as product_name, omi.short_code as code, omi.menu_id, omi.category_id 
         FROM item_option_groups iog
         JOIN outlet_menu_items omi ON iog.item_id = omi.id
         WHERE iog.group_id = $1`,
         [group.id]
      );
      
      let linked = itemsRes.rows;
      if (linked.length === 0) {
        // Self-healing fallback for orphaned item references (e.g. after menu re-imports)
        const targetOutlet = (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') ? outlet_id : ownerId;
        const activeMenuRes = await pool.query(
          `SELECT id FROM outlet_menus 
           WHERE (outlet_id = $1 OR user_id = $1) 
             AND (is_digital_default = true OR is_pos_default = true) 
           LIMIT 1`,
          [targetOutlet]
        );
        const activeMenuId = activeMenuRes.rows[0]?.id;
        if (activeMenuId) {
          const matchedItemRes = await pool.query(
            `SELECT id, item_name as product_name, short_code as code, menu_id, category_id 
             FROM outlet_menu_items 
             WHERE menu_id = $1 AND item_name ILIKE $2 AND (item_type = '0' OR item_type = 'main') 
             LIMIT 1`,
            [activeMenuId, group.name]
          );
          if (matchedItemRes.rows.length > 0) {
            const matchedItem = matchedItemRes.rows[0];
            console.log(`[SELF-HEALING] Healing option group '${group.name}' (ID: ${group.id}): updating stale link to active item '${matchedItem.product_name}' (ID: ${matchedItem.id})`);
            await pool.query("DELETE FROM item_option_groups WHERE group_id = $1", [group.id]);
            await pool.query(
              "INSERT INTO item_option_groups (item_id, group_id) VALUES ($1, $2)",
              [matchedItem.id, group.id]
            );
            linked = [{
              item_id: matchedItem.id,
              product_name: matchedItem.product_name,
              code: matchedItem.code,
              menu_id: matchedItem.menu_id,
              category_id: matchedItem.category_id
            }];
          }
        }
      }
      group.linked_main_items = linked;
    }

    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/option-groups
router.post("/", authMiddleware, async (req, res) => {
  let { name, min_selectable, max_selectable, is_addon, is_active, outlet_id, associated_options, linked_main_items } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
    outlet_id = req.user.id;
  }
  try {
    await pool.query("BEGIN");

    const result = await pool.query(
      `INSERT INTO option_groups (user_id, outlet_id, name, min_selectable, max_selectable, is_addon, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [ownerId, outlet_id || null, name, parseInt(min_selectable) || 0, parseInt(max_selectable) || 1, !!is_addon, is_active !== undefined ? !!is_active : true]
    );
    const newGroup = result.rows[0];
    const groupId = newGroup.id;

    if (Array.isArray(associated_options)) {
      for (let option of associated_options) {
        let optionName = option.name;
        if (!optionName && typeof option === 'number') {
          const itemRes = await pool.query("SELECT item_name FROM outlet_menu_items WHERE id = $1", [option]);
          if (itemRes.rows.length > 0) optionName = itemRes.rows[0].item_name;
        } else if (typeof option === 'object' && option.product_name) {
          optionName = option.product_name;
        }

        if (optionName) {
          await pool.query(
            `INSERT INTO options_list (group_id, name, price_override, is_active) 
             VALUES ($1, $2, $3, $4)`,
            [groupId, optionName, option.price_override !== undefined ? option.price_override : (option.base_price || option.price || 0), true]
          );
        }
      }
    }

    if (Array.isArray(linked_main_items)) {
      for (let item of linked_main_items) {
        const itemId = typeof item === 'object' ? item.id || item.item_id : item;
        await pool.query(
          `INSERT INTO item_option_groups (item_id, group_id) 
           VALUES ($1, $2)`,
          [itemId, groupId]
        );
      }
    }

    await pool.query("COMMIT");
    res.json(newGroup);
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/option-groups/:id
router.put("/:id", authMiddleware, async (req, res) => {
  const { name, min_selectable, max_selectable, is_addon, is_active, associated_options, linked_main_items } = req.body;
  const ownerId = req.user.bizId || req.user.id;
  const groupId = req.params.id;
  try {
    await pool.query("BEGIN");

    const result = await pool.query(
      `UPDATE option_groups 
       SET name=$1, min_selectable=$2, max_selectable=$3, is_addon=$4, is_active=$5 
       WHERE id=$6 AND user_id=$7 RETURNING *`,
      [name, parseInt(min_selectable) || 0, parseInt(max_selectable) || 1, !!is_addon, !!is_active, groupId, ownerId]
    );

    if (result.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ error: "Option group not found or unauthorized" });
    }

    await pool.query("DELETE FROM options_list WHERE group_id = $1", [groupId]);
    if (Array.isArray(associated_options)) {
      for (let option of associated_options) {
        let optionName = option.name;
        if (!optionName && (typeof option === 'number' || typeof option === 'string')) {
          const itemRes = await pool.query("SELECT item_name FROM outlet_menu_items WHERE id = $1", [option]);
          if (itemRes.rows.length > 0) optionName = itemRes.rows[0].item_name;
        } else if (typeof option === 'object' && option.product_name) {
          optionName = option.product_name;
        }

        if (optionName) {
          await pool.query(
            `INSERT INTO options_list (group_id, name, price_override, is_active) 
             VALUES ($1, $2, $3, $4)`,
            [groupId, optionName, option.price_override !== undefined ? option.price_override : (option.base_price || option.price || 0), true]
          );
        }
      }
    }

    await pool.query("DELETE FROM item_option_groups WHERE group_id = $1", [groupId]);
    if (Array.isArray(linked_main_items)) {
      for (let item of linked_main_items) {
        const itemId = typeof item === 'object' ? item.id || item.item_id : item;
        await pool.query(
          `INSERT INTO item_option_groups (item_id, group_id) 
           VALUES ($1, $2)`,
          [itemId, groupId]
        );
      }
    }

    await pool.query("COMMIT");
    res.json(result.rows[0]);
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/option-groups/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  const ownerId = req.user.bizId || req.user.id;
  try {
    await pool.query("BEGIN");
    await pool.query("DELETE FROM options_list WHERE group_id = $1", [req.params.id]);
    await pool.query("DELETE FROM item_option_groups WHERE group_id = $1", [req.params.id]);
    await pool.query("DELETE FROM option_groups WHERE id = $1 AND user_id = $2", [req.params.id, ownerId]);
    await pool.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
