import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import  './Button.css';

function Button({ children, disabled, size, theme, className, onClick, wide, type, loading }) {
    const composedClassName = classNames(className, 'button', `${theme}`, `${size}`, {
        'loading': loading,
        'disabled': disabled,
        'wide': wide,
    });
    return (
        <button className={composedClassName} disabled={disabled} onClick={onClick} type={type}>
            <div className={'contents'}>{children}</div>
             {loading && <div className={'loader'} />}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.node,
    theme: PropTypes.oneOf(['primary', 'secondary', 'negative', 'back', 'link']),
    disabled: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    wide: PropTypes.bool,
    loading: PropTypes.bool,
};

Button.defaultProps = {
    disabled: false,
    theme: 'primary',
    className: '',
    type: 'button',
    wide: false,
    loading: false,
};

export default Button;
