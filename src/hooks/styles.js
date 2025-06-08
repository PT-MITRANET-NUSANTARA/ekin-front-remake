import { createStyles } from 'antd-style';

const useStyle = createStyles(({ prefixCls, css }) => ({
  customButton: css`
    &.${prefixCls}-btn-warning:not(.${prefixCls}-btn-dangerous):not(.${prefixCls}-btn-primary) {
      border-width: 0;
      background-color: #fbd21a;
      color: #fff;

      > span {
        position: relative;
      }

      &:disabled {
        background-color: #f5f5f5;
        color: #a6a6a6;
        cursor: not-allowed;
        opacity: 0.6;
      }

      &.outlined {
        background-color: #fff;
        border: 1px solid #fbd21a;
        color: #fbd21a;

        &:hover {
          background-color: #fbd21a;
          color: #fff;
        }

        &:disabled {
          background-color: #f5f5f5;
          border-color: #d4d4d4;
          color: #a6a6a6;
        }
      }

      &:hover:not(.outlined):not(:disabled) {
        background-color: #fcd34d;
        color: #fff;
      }
    }

    &.${prefixCls}-btn-info:not(.${prefixCls}-btn-dangerous):not(.${prefixCls}-btn-primary) {
      border-width: 0;
      background-color: #0ea5e9;
      color: #fff;

      > span {
        position: relative;
      }

      &:disabled {
        background-color: #f5f5f5;
        color: #a6a6a6;
        cursor: not-allowed;
        opacity: 0.6;
      }

      &.outlined {
        background-color: #fff;
        border: 1px solid #0ea5e9;
        color: #0ea5e9;

        &:hover {
          background-color: #0ea5e9;
          color: #fff;
        }

        &:disabled {
          background-color: #f5f5f5;
          border-color: #d4d4d4;
          color: #a6a6a6;
        }
      }

      &:hover:not(.outlined):not(:disabled) {
        background-color: #38bdf8;
        color: #fff;
      }
    }

    &.${prefixCls}-btn-success:not(.${prefixCls}-btn-dangerous):not(.${prefixCls}-btn-primary) {
      border-width: 0;
      background-color: #6fb513;
      color: #fff;

      > span {
        position: relative;
      }

      &:disabled {
        background-color: #f5f5f5;
        color: #a6a6a6;
        cursor: not-allowed;
        opacity: 0.6;
      }

      &.outlined {
        background-color: #fff;
        border: 1px solid #6fb513;
        color: #6fb513;

        &:hover {
          background-color: #6fb513;
          color: #fff;
        }

        &:disabled {
          background-color: #f5f5f5;
          border-color: #d4d4d4;
          color: #a6a6a6;
        }
      }

      &:hover:not(.outlined):not(:disabled) {
        background-color: #4ade80;
        color: #fff;
      }
    }

    &.${prefixCls}-btn-danger {
      &.outlined {
        background-color: #fff;
        border: 1px solid #ff6721;
        color: #ff6721;

        &:hover {
          background-color: #ff6721;
          color: #fff;
        }
      }
    }

    &.${prefixCls}-btn-primary {
      &.outlined {
        background-color: #fff;
        border: 1px solid #a855f7;
        color: #a855f7;

        &:hover {
          background-color: #a855f7;
          color: #fff;
        }
      }
    }
  `
}));

export default useStyle;
