import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiAvatar } from '@material-ui/core/Avatar'
import transparent from './transparent.png'
import { connect } from 'react-redux'

/**
 * @component
 * Shows an circular avatar with initials or img
 */
export const Avatar = props => {
  const { big, small, avatar, initials, style, cardAvatar, userName, alt, dispatch, userId, ...otherProps } = props
  
  const dim = big
    ? '45px'
    : small
      ? '20px'
      : cardAvatar
        ? '38px'
        : '30px'
  
  const common = {
    width: dim,
    height: dim,
    fontSize: small ? '.5rem' : '.8rem',
    ...style
  }
  
  const styles = {
    backgroundColor: '#e9e9e9',
    color: 'black',
    fontSize: '.8rem',
    ...common
  }
  
  const cardAvatarStyles = {
    border: 'solid 3px white',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19)',
    ...styles
  }
  
  const avStyles = cardAvatar ? cardAvatarStyles : styles
  const altText = alt !== '' ? alt : `${userName}'s avatar`
  
  return avatar
    ? <MuiAvatar style={avStyles} alt={altText} {...otherProps} src={avatar} />
    : (
      <MuiAvatar style={avStyles} {...otherProps}>
        <img src={transparent} alt={alt} style={{ display: 'none' }} />
        {initials}
      </MuiAvatar>
    )
  
}

Avatar.propTypes = {
  /**
   * If true, the avatar is 45x45 px. If false, the avatar is 30x30
   */
  big: PropTypes.bool,
  /**
   * Image src of the avatar
   */
  avatar: PropTypes.any,
  /**
   * Initials of user, if avatar img src is undefined
   */
  initials: PropTypes.any,
  /**
   * Can override any default style
   */
  style: PropTypes.object,
  /**
   * If true, avatar will have a white border around it with box shadow (similar to Card)
   */
  cardAvatar: PropTypes.bool,
  /**
   * The first and last name of the user for which the avatar was created (needed for aria-label attribute)
   */
  userName: PropTypes.string,
  /**
   * alt text for image
   */
  alt: PropTypes.string,
  /**
   * User id
   */
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

Avatar.defaultProps = {
  big: false,
  cardAvatar: false,
  initials: '',
  style: {},
  userName: '',
  alt: '',
  userId: 0
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const user = ownProps.userId ? state.data.user.byId[ownProps.userId] : {}
  
  return {
    userName: user.username,
    initials: user.initials,
    avatar: user.avatar,
    ...ownProps
  }
}

export default connect(mapStateToProps, null)(Avatar)
