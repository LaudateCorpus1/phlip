import React from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, IconButton } from 'components'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import CodingValidationAvatar from '../../../QuestionCard/components/QuestionContent/components/CodingValidationAvatar'
import theme from 'services/theme'

/**
 * The AnnotationFinder that shows at the top of an open document. Lets the user filter annotations by user and jump to
 * previous and next annotations
 * @component
 */
export const AnnotationFinder = props => {
  const { count, current, users, onScrollAnnotation, onClickAvatar, allEnabled } = props
  
  const containerStyles = {
    backgroundColor: 'black',
    minWidth: '40%',
    zIndex: 200,
    height: 37,
    background: '#0000008a'
  }
  
  const disabledColor = `rgba(0, 0, 0, 0.54)`
  
  return (
    <FlexGrid raised container type="row" align="center" justify="flex-end" padding="0 8px" style={containerStyles}>
      <FlexGrid container type="row" align="center" padding="0 10px 0 0" flex>
        {users.map((user, i) => {
          return (
            <FlexGrid style={{ marginRight: 5 }} key={`${user.id}-anno-avatar-${i}`}>
              <CodingValidationAvatar
                user={user}
                size="medium"
                isValidator={user.isValidator}
                onClick={onClickAvatar && !user.enabled
                  ? onClickAvatar(user.userId, user.isValidator)
                  : null}
                enabled={
                  onClickAvatar
                    ? users.length > 1
                      ? user.enabled
                      : true
                    : false
                }
              />
            </FlexGrid>
          )
        })}
        {users.length > 1 && <CodingValidationAvatar
          style={{ backgroundColor: theme.palette.primary.main, color: 'white' }}
          user={{ initials: 'ALL', username: 'All annotations' }}
          enabled={allEnabled}
          onClick={!allEnabled
            ? onClickAvatar('All', false)
            : null}
          isValidator={false}
          size="medium"
        />}
      </FlexGrid>
      <FlexGrid style={{ marginRight: 15 }}>
        <Typography style={{ color: 'white' }}>
          {current + 1}/{count}
        </Typography>
      </FlexGrid>
      <FlexGrid style={{ borderLeft: '2px solid white', height: '50%' }} />
      <FlexGrid style={{ marginLeft: 8 }}>
        <IconButton
          onClick={() => onScrollAnnotation(current - 1)}
          disabled={current === 0}
          color={current === 0 ? disabledColor : 'white'}>
          keyboard_arrow_up
        </IconButton>
        <IconButton
          onClick={() => onScrollAnnotation(current + 1)}
          disabled={current === count - 1}
          color={current === count - 1 ? disabledColor : 'white'}>
          keyboard_arrow_down
        </IconButton>
      </FlexGrid>
    </FlexGrid>
  )
}

AnnotationFinder.propTypes = {
  count: PropTypes.number,
  current: PropTypes.number,
  users: PropTypes.array,
  onScrollAnnotation: PropTypes.func,
  onClickAvatar: PropTypes.func,
  allEnabled: PropTypes.bool
}

AnnotationFinder.defaultProps = {
  users: [],
  current: 0,
  count: 0,
  allEnabled: true
}

const mapStateToProps = /* istanbul ignore next */ (state, ownProps) => {
  return {
    users: ownProps.users.map(user => {
      return {
        ...user,
        ...state.data.user.byId[user.userId]
      }
    })
  }
}

export default connect(mapStateToProps)(AnnotationFinder)
