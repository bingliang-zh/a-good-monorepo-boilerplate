export const sum = (a: number, b: number): number => {
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('boop');
    }
    return a + b;
};
