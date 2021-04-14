import classNames from 'classnames';

export default function Button({ children, rootClass, ...propagated }) {
    const buttonClasses = classNames('button');
    
    return (
        <button className={buttonClasses} {...propagated}>{children}</button>
    )
}