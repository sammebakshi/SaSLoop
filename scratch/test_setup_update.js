const pool = require("../db");

async function run() {
  try {
    const userId = 48;
    const body = {
      "loyalty_enabled": true,
      "loyalty_joining_points": 100,
      "loyalty_bill_amount_threshold": 1000,
      "loyalty_points_earned": 10,
      "loyalty_points_dinein": true,
      "loyalty_points_pickup": true,
      "loyalty_points_delivery": true,
      "points_to_amount_ratio": 0.1,
      "min_redeem_points": 300,
      "max_redeem_per_order": 300
    };

    const existing = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
    if (existing.rows.length === 0) {
      console.log("No restaurant found!");
      return;
    }
    const e = existing.rows[0];

    console.log("Executing update query...");
    const result = await pool.query(
      `UPDATE restaurants 
       SET name=$1, phone=$2, address=$3, business_type=$4, settings=$5,
           latitude=$6, longitude=$7, delivery_radius_km=$8,
           kitchen_number=$9, notification_numbers=$10, track_inventory=$11, low_stock_threshold=$12, currency_code=$13,
            cgst_percent=$14, sgst_percent=$15, gst_included=$16, show_gst_on_receipt=$17,
            logo_url=$18, banner_url=$19, social_instagram=$20, social_facebook=$21, social_twitter=$22, social_youtube=$23, social_website=$24,
            loyalty_enabled=$25, points_per_100=$26, points_to_amount_ratio=$27, min_redeem_points=$28, max_redeem_per_order=$29,
            delivery_tiers=$30, is_auth_required=$31, fulfillment_options=$32, brand_name=$33,
            loyalty_joining_points=$34, loyalty_bill_amount_threshold=$35, loyalty_points_earned=$36,
            loyalty_points_dinein=$37, loyalty_points_pickup=$38, loyalty_points_delivery=$39
        WHERE user_id=$40 RETURNING *`,
      [
        body.name !== undefined ? body.name : e.name, 
        body.phone !== undefined ? body.phone : e.phone, 
        body.address !== undefined ? body.address : e.address, 
        body.businessType !== undefined ? body.businessType : e.business_type, 
        JSON.stringify(body.settings !== undefined ? { ...(e.settings || {}), ...body.settings } : (e.settings || {})),
        (body.latitude !== undefined && body.latitude !== "") ? body.latitude : (body.latitude === "" ? null : e.latitude), 
        (body.longitude !== undefined && body.longitude !== "") ? body.longitude : (body.longitude === "" ? null : e.longitude), 
        body.delivery_radius_km !== undefined ? body.delivery_radius_km : e.delivery_radius_km,
        body.kitchen_number !== undefined ? body.kitchen_number : e.kitchen_number, 
        body.notification_numbers !== undefined ? body.notification_numbers : e.notification_numbers, 
        body.track_inventory !== undefined ? body.track_inventory : e.track_inventory, 
        body.low_stock_threshold !== undefined ? body.low_stock_threshold : e.low_stock_threshold, 
        body.currency_code !== undefined ? body.currency_code : e.currency_code,
        body.cgst_percent !== undefined ? parseFloat(body.cgst_percent) : e.cgst_percent, 
        body.sgst_percent !== undefined ? parseFloat(body.sgst_percent) : e.sgst_percent, 
        body.gst_included !== undefined ? !!body.gst_included : e.gst_included, 
        body.show_gst_on_receipt !== undefined ? !!body.show_gst_on_receipt : e.show_gst_on_receipt,
        body.logo_url !== undefined ? body.logo_url : e.logo_url, 
        body.banner_url !== undefined ? body.banner_url : e.banner_url, 
        body.social_instagram !== undefined ? body.social_instagram : e.social_instagram, 
        body.social_facebook !== undefined ? body.social_facebook : e.social_facebook, 
        body.social_twitter !== undefined ? body.social_twitter : e.social_twitter, 
        body.social_youtube !== undefined ? body.social_youtube : e.social_youtube, 
        body.social_website !== undefined ? body.social_website : e.social_website,
        body.loyalty_enabled !== undefined ? !!body.loyalty_enabled : e.loyalty_enabled,
        body.points_per_100 !== undefined ? parseInt(body.points_per_100) : e.points_per_100,
        body.points_to_amount_ratio !== undefined ? parseFloat(body.points_to_amount_ratio) : e.points_to_amount_ratio,
        body.min_redeem_points !== undefined ? parseInt(body.min_redeem_points) : e.min_redeem_points,
        body.max_redeem_per_order !== undefined ? parseInt(body.max_redeem_per_order) : e.max_redeem_per_order,
        JSON.stringify(body.delivery_tiers !== undefined ? body.delivery_tiers : (e.delivery_tiers || [])),
        body.is_auth_required !== undefined ? !!body.is_auth_required : e.is_auth_required,
        JSON.stringify(body.fulfillment_options !== undefined ? body.fulfillment_options : (e.fulfillment_options || {dinein: true, pickup: true, delivery: true})),
        body.brand_name !== undefined ? body.brand_name : e.brand_name,
        body.loyalty_joining_points !== undefined ? parseInt(body.loyalty_joining_points) : e.loyalty_joining_points,
        body.loyalty_bill_amount_threshold !== undefined ? parseFloat(body.loyalty_bill_amount_threshold) : e.loyalty_bill_amount_threshold,
        body.loyalty_points_earned !== undefined ? parseInt(body.loyalty_points_earned) : e.loyalty_points_earned,
        body.loyalty_points_dinein !== undefined ? !!body.loyalty_points_dinein : e.loyalty_points_dinein,
        body.loyalty_points_pickup !== undefined ? !!body.loyalty_points_pickup : e.loyalty_points_pickup,
        body.loyalty_points_delivery !== undefined ? !!body.loyalty_points_delivery : e.loyalty_points_delivery,
        userId
      ]
    );

    console.log("Update executed successfully! Resulting row:");
    console.log(result.rows[0]);
  } catch (err) {
    console.error("SQL Exception caught:", err);
  } finally {
    await pool.end();
  }
}

run();
