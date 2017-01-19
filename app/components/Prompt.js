// jshint esversion: 6, asi: true
// eslint-env es6

import React from 'react'
import { connect } from 'react-redux'

const Modal = ({ prompt, dispatch }) => {
  const { isVisible, promptText, confirmText, cancelText, callback } = prompt

  return (
    <dialog className='mdl-dialog' open={isVisible ? true : false}>
      <div className='mdl-dialog__content'>
        <p>{promptText}</p>
      </div>
      <div className='mdl-dialog__actions'>
        <button type='button' className='mdl-button' onClick={callback}>{confirmText}</button>
        <button type='button' className='mdl-button close' onClick={() => dispatch({ type: 'PROMPT_CLOSE' })}>{cancelText}</button>
      </div>
    </dialog>
  )
}

const mapStateToProps = ({ prompt }) => ({ prompt })

export default connect(mapStateToProps)(Modal)
