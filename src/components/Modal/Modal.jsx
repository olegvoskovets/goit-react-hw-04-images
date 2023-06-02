//import { PropTypes } from 'prop-types';
import { Component, useEffect } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal_root');

export const Modal = ({ onCloseModal, children }) => {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        onCloseModal('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleBackdrop = event => {
    const { target, currentTarget } = event;
    if (target === currentTarget) {
      onCloseModal('');
    }
  };
  const closeModal = () => {
    onCloseModal('');
  };

  return createPortal(
    <div className={css.Modal_backdroup} onClick={handleBackdrop}>
      <div className={css.Modal_contant}>
        <button type="button" className={css.closeBtn} onClick={closeModal}>
          <CloseIcon sx={{ fontSize: 12 }} />
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};
