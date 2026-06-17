// ZATCA E-Invoicing (Phase 1) QR Code Generator
// Decoded from TMBill source code

function toHex(value) {
    let hex = value.toString(16);
    if ((hex.length % 2) > 0) {
        hex = '0' + hex;
    }
    return Buffer.from(hex, 'hex').toString('utf-8');
}

class Tag {
    constructor(tag, value) {
        this.tag = tag;
        this.value = String(value); // Ensure value is a string
    }

    toTlv() {
        return toHex(this.tag) + toHex(Buffer.byteLength(this.value)) + this.value;
    }
}

function tagsToBase64(tags) {
    const tlv = tags.map(tag => tag.toTlv()).join('');
    return Buffer.from(tlv).toString('base64');
}

const ZATCA_TAGS = {
    SELLER_NAME: 1,
    SELLER_TRN: 2,
    INVOICE_DATE: 3,
    INVOICE_TOTAL: 4,
    VAT_TOTAL: 5
};

module.exports = {
    Tag,
    tagsToBase64,
    ZATCA_TAGS
};
