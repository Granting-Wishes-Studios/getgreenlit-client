import * as React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

interface Props {
  children: JSX.Element
  showModal: any
  setShowModal: React.Dispatch<React.SetStateAction<Boolean>>
}
export const BasicModal: React.FC<Props> = (props) => {
  const handleClose = () => props.setShowModal(false)
  const style = {
    position: 'absolute' as 'absolute',
    minWidth: '50%',
    maxWidth: "95%",
    overflow: 'hidden',
    boxShadow: 24,
    p: 0,
    margin: "auto",
  }
  
  const myStyle = {
    overflow: 'auto',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    p: 4,
  }
  return (
    <Modal
      open={props.showModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={myStyle}
    >
      <Box sx={style}>{props.children}</Box>
    </Modal>
  )
}
