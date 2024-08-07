import React from 'react';
import { Button as AntdButton, ButtonProps } from 'antd';
import classNames from 'classnames';
import './index.css';

export const RabbyButton: React.FC<ButtonProps> = (props) => {
  const { className, ...rest } = props;
  return (
    <AntdButton
      prefixCls="lux-button"
      type="primary"
      className={classNames(
        'w-[172px] text-[13px] h-[34px] rounded-[5px]',
        'bg-color-[#fff] outline-none border border-transparent cursor-pointer shadow',
        'text-[#000]',
        'hover:bg-opacity-80',
        {
          'opacity-30 cursor-not-allowed hover:bg-opacity-100':
            // eslint-disable-next-line react/destructuring-assignment
            props.disabled || props.loading,
        },
        className
      )}
      {...rest}
    />
  );
};
