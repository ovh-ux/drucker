export default (less) => {
    const registry = less.functions.functionRegistry;
    const Dimension = less.tree.Dimension;

    return {
        'rem-base': (base) => {
            if (!base) {
                return less.data['rem-base'] || new Dimension(16, 'px');
            }
            base = new Dimension(registry.get('unit')(base).value, 'px');
            less.data['rem-base'] = base;

            return base;
        },
        'rem-calc': (value, base) => {
            base = base || registry.get('rem-base')();
            const baseUnit = registry.get('get-unit')(base).value.backupUnit;
            base = registry.get('unit')(base).value;

            if (baseUnit === '%') {
                base = (base / 100) * 16;
            }

            if (baseUnit === 'rem') {
                base *= 16;
            }

            if (baseUnit === 'em') {
                base *= 16;
            }

            if (!value) {
                return new Dimension(0);
            }

            const calculus = parseFloat((value.value / base).toFixed(3));

            return new Dimension(calculus, 'rem');
        },
    };
};
