class DictWord {
    constructor(dict) {
        this.dict = dict;
    }

    getText(value) {
        let f = this.dict.find(x => x.value === value);
        return f === undefined ? "" : f.text;
    }

    getValue(text) {
        let f = this.dict.find(x => x.text === text);
        return f === undefined ? null : f.value;
    }

    getColor(value) {
        let f = this.dict.find(x => x.value === value);
        return (f && 'color' in f) ? f.color : '#FFFFFF';
    }
}

const dictionary = { 
    sample: new DictWord([
        {
            value: 0,
            text: 'None',
        },
        {
            value: 1,
            text: 'Wait',
        },
        {
            value: 2,
            text: 'Wait until confirmation',
        },
    ]),
};

export default dictionary;
