import {Util} from './Util';

const rules = {          
    required: value => !!value || 'Required',          
    number: value => Util.isNumber(value) || 'Number only',
    positive: value => value > 0 || 'The number should be > 0',
    notNegative: value => value >= 0 || 'The number should be >=0',    
    password: (v) => !!v || "Password required",
    id: (v) => !!v || "ID required",
};

export default rules;