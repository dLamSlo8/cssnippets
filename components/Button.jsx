import classNames from 'classnames';

export default function Button({ children, rootClass, ...propagated }) {
    const buttonClasses = classNames('c-button', rootClass);
    
    return (
        <button className={buttonClasses} {...propagated}>{children}</button>
    )
}