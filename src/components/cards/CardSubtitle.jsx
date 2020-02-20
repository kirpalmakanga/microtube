const CardTitle = ({ children, className, ...props }) => (
    <h3 className={['card__subtitle', className].join(' ')} {...props}>
        {children}
    </h3>
);

export default CardTitle;
