class KycState {
    static get NEW() { return 'NEW'; }
    static get EMAILED() { return 'EMAILED'; }
    static get SUBMITTED() { return 'SUBMITTED'; }
    static get APPROVED() { return 'APPROVED'; }
    static get REJECTED() { return 'REJECTED'; }

    static title(val) {
        switch (val) {
            case this.NEW:
                return 'new';
            case this.EMAILED:
                return 'emailed';
            case this.SUBMITTED:
                return 'submited';
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