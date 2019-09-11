import React from 'react'
import { GU, textStyle, useTheme } from '@aragon/ui'
import {formatTokenAmount} from "../../lib/format-utils";

const splitAmount = amount => {
  const [integer, fractional] = formatTokenAmount(amount).split('.')
  return (
    <span>
      <span>{integer}</span>
      {fractional && (
        <span
          css={`
            ${textStyle('body3')}
          `}
        >
          .{fractional}
        </span>
      )}
    </span>
  )
}

const BalanceToken = ({
  amount,
  compact,
  symbol,
  verified,
  convertedAmount = -1,
}) => {
  const theme = useTheme()

  return (
    <React.Fragment>
      <div
        title={symbol || 'Unknown symbol'}
        css={`
          display: flex;
          align-items: center;
          color: ${theme.surfaceContentSecondary};
          ${textStyle('body2')}
          text-transform: uppercase;
          font-size: 28px;
          ${!compact && `font-size: 14px;`}
        `}
      >
        {verified && symbol && (
          <img
            alt=""
            width="20"
            height="20"
            src={`https://chasing-coins.com/coin/logo/${symbol}`}
            css={`
              margin-right: ${0.75 * GU}px;
            `}
          />
        )}
        {symbol || '?'}
      </div>
        <div css={`
      text-align: right;
      ${!compact && `text-align: left;`}
    `}>
        <div
          css={`
            ${textStyle('title2')}
            margin: ${(compact ? 1 : 1.5) * GU}px 0;
          `}
        >
          {splitAmount(amount.toFixed(3))}
        </div>
        <div
          css={`
            color: ${theme.surfaceContentSecondary};
            ${textStyle('body2')}
          `}
        >
          {convertedAmount >= 0
            ? `$${formatTokenAmount(convertedAmount.toFixed(2))}`
            : '−'}
        </div>
      </div>
    </React.Fragment>
  )
}

export default BalanceToken
