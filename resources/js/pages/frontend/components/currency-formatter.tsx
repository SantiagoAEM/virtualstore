function CurrencyFormatter({
    amount,
    currency = 'USD',
    locale,
}: {
    amount: number;
    currency?: string;
    locale?: string;
}) {
    // Formateamos con Intl
    const formatted = new Intl.NumberFormat(locale || undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

    // Separamos la parte entera y la decimal
    const [integerPart, decimalPart] = formatted.split('.');

    return (
        <span>
            {integerPart}
            {decimalPart && (
                <span className="text-sm align-top leading-relaxed">{decimalPart}</span>
            )}
        </span>
    );
}
export default CurrencyFormatter;
