import React from 'react'
import PropTypes from 'prop-types'
import { Manager, Popper, Reference } from 'react-popper'
import Typography from '@material-ui/core/Typography'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Divider from '@material-ui/core/Divider'
import { IconButton, FlexGrid } from 'components'

export const Popover = props => {
  const { target, open, title, onOpen, onClose, children } = props

  return (
    <Manager>
      <Reference>
        {({ ref }) => {
          return (
            <div ref={ref}>
              <IconButton
                placement="top"
                tooltipText={target.tooltip}
                aria-label={target.tooltip}
                id={target.id}
                color={target.color}
                style={target.style}
                onClick={onOpen}>
                {target.icon}
              </IconButton>
            </div>
          )
        }}
      </Reference>
      <Popper
        placement="bottom-end"
        eventsEnabled={open}
        style={{ pointerEvents: open ? 'auto' : 'none' }}>
        {({ ref, style, placement }) => (
          open &&
          <ClickAwayListener onClickAway={open ? onClose : () => {}}>
            <div ref={ref} data-placement={placement} style={{ marginTop: 5, ...style, zIndex: 20 }}>
              <FlexGrid raised container>
                <FlexGrid padding={16} flex>
                  <Typography variant="body2">{title}</Typography>
                </FlexGrid>
                <Divider />
                {children}
              </FlexGrid>
            </div>
          </ClickAwayListener>
        )}
      </Popper>
    </Manager>
  )
}

Popover.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  target: PropTypes.any,
  children: PropTypes.any
}

export default Popover
