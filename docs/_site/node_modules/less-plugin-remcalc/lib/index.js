import functions from './functions';

export default {
    install: (less) => {
        less.functions.functionRegistry.addMultiple(functions(less));
    },
};
