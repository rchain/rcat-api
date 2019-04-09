class KycState {
    static get SUBMITED() { return 'SUBMITED'; }
    static get EMAILED() { return 'EMAILED'; }
    static get APPROVED() { return 'APPROVED'; }
    static get REJECTED() { return 'REJECTED'; }

    static title(val) {
        switch (val) {
            case this.SUBMITED:
                return 'submited';
            case this.EMAILED:
                return 'emailed';
            case this.APPROVED:
                return 'approved';
            case this.REJECTED:
                return 'rejected';
            default:
                return 'unknown';
        }
    }
}

module.exports = KycState;