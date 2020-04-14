import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, FlexGrid, Icon, Tooltip } from 'components'
import theme from 'services/theme'

const sizeObj = {
  'small': {
    height: 20,
    width: 20,
    fontSize: '0.5rem'
  },
  'medium': {
    height: 27,
    width: 27,
    fontSize: '0.6rem'
  },
  'large': {
    height: 30,
    width: 30,
    fontSize: '0.8rem'
  }
}

const validatorCheck = {
  'small': {
    height: 8,
    width: 8,
    fontSize: '0.5rem'
  },
  'medium': {
    height: 9,
    width: 9,
    fontSize: '0.6rem'
  },
  'large': {
    height: 12,
    width: 12,
    fontSize: '0.8rem'
  }
}

export const CodingValidationAvatar = ({ user, size, isValidator, enabled, onClick, style }) => {
  const selectedStyle = {
    border: `2px solid ${theme.palette.error.main}`,
    boxSizing: 'border-box'
  }
  
  return (
    <Tooltip text={user.username}>
      <FlexGrid container align="flex-end" style={{ position: 'relative' }}>
        <Avatar
          avatar={user.avatar}
          initials={user.initials}
          userName={user.username}
          style={{
            margin: 0,
            outline: 0,
            backgroundColor: '#e9e9e9',
            color: 'black',
            cursor: onClick ? 'pointer' : 'default',
            ...sizeObj[size],
            ...enabled ? selectedStyle : {},
            ...style
          }}
          onClick={onClick}
        />
        {isValidator && <Avatar
          style={{
            position: 'absolute',
            ...validatorCheck[size],
            backgroundColor: '#80d134',
            border: '2px solid white',
            top: 16,
            left: 16
          }}
          cardAvatar
          initials={<Icon
            size={`${validatorCheck[size].height}px`}
            color="white"
            style={{ fontWeight: 800 }}>check</Icon>}
        />}
      </FlexGrid>
    </Tooltip>
  )
}

CodingValidationAvatar.propTypes = {
  user: PropTypes.object,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  isValidator: PropTypes.bool,
  onClick: PropTypes.func,
  enabled: PropTypes.bool,
  style: PropTypes.object
}

CodingValidationAvatar.defaultProps = {
  enabled: false,
  isValidator: false,
  onClick: undefined,
  size: 'large',
  user: {},
  style: {}
}

export default CodingValidationAvatar
