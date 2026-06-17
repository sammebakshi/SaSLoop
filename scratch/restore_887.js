"router.get(\"/tax-groups\", authMiddleware, async (req, res) => {\n  const { outlet_id } = req.query;\n  try {\n    let query = `\n      SELECT tg.*, r.name as outlet_name \n      FROM tax_product_groups tg\n      LEFT JOIN restaurants r ON tg.outlet_id =
<truncated 1656 bytes>
