export const generateStandee = async (qrUrl, bizData, type = "ORDER", tableNum = null) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // High-Resolution Portrait (A4 Ratio)
    canvas.width = 1200;
    canvas.height = 1800;

    // 1. CLEAN WHITE BASE
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. LUXE EMERALD BORDER
    const borderWidth = 25;
    ctx.strokeStyle = "#065f46"; 
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth/2, borderWidth/2, canvas.width - borderWidth, canvas.height - borderWidth);

    // 3. TOP BRANDING AREA
    ctx.fillStyle = "#065f46";
    ctx.fillRect(0, 0, canvas.width, 400);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "600 40px Inter, system-ui";
    ctx.fillText("ORDER & PAY ON", canvas.width / 2, 120);
    
    ctx.font = "900 160px Inter, system-ui";
    ctx.fillText("WhatsApp", canvas.width / 2, 280);

    // 4. QR CODE (Clean & Large)
    const qrSize = 650;
    const qX = (canvas.width - qrSize) / 2;
    const qY = 550;

    // Load and Draw QR
    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = qrUrl;
    
    await new Promise((resolve) => {
      qrImg.onload = resolve;
    });

    // Shadow for QR
    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowBlur = 40;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(qX - 20, qY - 20, qrSize + 40, qrSize + 40);
    ctx.shadowBlur = 0;

    ctx.drawImage(qrImg, qX, qY, qrSize, qrSize);

    // 5. SMART BUSINESS NAME (Auto-scaling)
    const bizName = (bizData?.name || "Our Business").toUpperCase();
    ctx.fillStyle = "#0f172a";
    
    // Start with large font and shrink until it fits
    let fontSize = 90;
    ctx.font = `900 ${fontSize}px Inter, system-ui`;
    while (ctx.measureText(bizName).width > (canvas.width - 200) && fontSize > 40) {
        fontSize -= 5;
        ctx.font = `900 ${fontSize}px Inter, system-ui`;
    }
    ctx.fillText(bizName, canvas.width / 2, 1350);
    
    // 6. TABLE / TYPE BADGE
    if (tableNum) {
      ctx.fillStyle = "#065f46";
      ctx.font = "900 60px Inter, system-ui";
      ctx.fillText(`TABLE ${tableNum}`, canvas.width / 2, 1450);
    } else {
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 50px Inter, system-ui";
      const label = type === "CRM" ? "JOIN OUR VIP CLUB" : (type === "HUMAN" ? "GET ASSISTANCE" : "SCAN TO ORDER");
      ctx.fillText(label, canvas.width / 2, 1450);
    }

    // 7. FOOTER INSTRUCTIONS
    ctx.fillStyle = "#065f46";
    ctx.font = "bold 35px Inter, system-ui";
    ctx.fillText("POWERED BY", canvas.width / 2, 1620);
    
    ctx.font = "900 65px Inter, system-ui";
    ctx.fillText("⚡ SaSLoop AI", canvas.width / 2, 1710);

    // 8. DOWNLOAD
    const filename = `SaSLoop_Elite_${type}_${tableNum || 'Main'}.png`;
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
};
