import { createPortal } from 'react-dom';
import css from './Modal.module.css'

const modalRoot = document.getElementById('modal-root')!;

export const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  return createPortal(
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot
  );
};
