import { Button } from 'antd';
import classNames from 'classnames';
import React from 'react';

export interface Props {
  title: string;
  buttonText: string;
  onButtonClick: () => void;
  loading?: boolean;
  isDone?: boolean;
  no: number;
  disabled?: boolean;
}

export const Step: React.FC<Props> = ({
  title,
  buttonText,
  onButtonClick,
  isDone,
  loading,
  no,
  disabled,
}) => {
  return (
    <div
      className={classNames('w-[126px] flex flex-col text-white text-center')}
    >
      <i className={classNames('mb-[5px]', 'opacity-20 text-[16px]')}>
        <span>{no}</span>
      </i>
      <h2
        className={classNames(
          'mb-[20px]',
          'text-white text-[15px] leading-[18px] font-bold'
        )}
      >
        {title}
      </h2>
      <Button
        disabled={disabled || isDone}
        loading={loading}
        prefixCls="rabby-button"
        className={classNames(
          'w-[94px] h-[33px] mx-auto rounded-[4px] text-[#000] font-bold',
          'bg-color-[#fff] outline-none border-none cursor-pointer shadow',
          {
            'text-[#00000080] cursor-not-allowed':
              loading || disabled || isDone,
            'bg-opacity-30 bg-color-[#fff]': loading || disabled,
            'bg-color-[#fff] bg-opacity-40 :hover:bg-color-[#d3d3d3]': isDone,
          }
        )}
        type="primary"
        onClick={onButtonClick}
        icon={
          isDone && (
            <img
              className="mr-[5px] opacity-50"
              src="lux-internal://assets/icons/mint/check.svg"
            />
          )
        }
      >
        <span className={classNames(loading && 'ml-[4px]')}>
          {isDone ? 'Done' : buttonText}
        </span>
      </Button>
    </div>
  );
};
