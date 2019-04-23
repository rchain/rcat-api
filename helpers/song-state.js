class SongState {
    static get NEW() { return 'NEW'; }
    static get UPLOADED_FOR_CONVERSION() { return 'UPLOADED_FOR_CONVERSION'; }
    static get PROCESSING() { return 'PROCESSING'; }

    static title(val) {
        switch (val) {
            case this.NEW:
                return 'new';
            case this.UPLOADED_FOR_CONVERSION:
                return 'uploaded';
            case this.PROCESSING:
                return 'processing';
            default:
                return 'unknown';
        }
    }
}

module.exports = SongState;