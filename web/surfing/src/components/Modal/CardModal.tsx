import { useClickOutside } from '~/util'
import styles from './CardModal.module.scss'
import { useRef } from 'react';
import { Card } from '../Container';
import Modal from './Modal';
import { ICard } from '../Container/Card/Card';
import { AnimatePresence, motion } from 'framer-motion';
import { Exit } from '../Images/Exit';

interface ICardModal extends ICard {
  id: string
  visible: boolean
  closeModal: () => void
  children: React.ReactNode
}

export const CardModal: React.FC<ICardModal> = ({
  id,
  visible,
  closeModal,
  children,
  type="frosted",
  border="solid",
  props,
}) => {
  const ref = useRef(null);

  useClickOutside(ref, () => { 
    console.log('clicked outside')
    closeModal() });

  return (
    <AnimatePresence>
      <Modal id={id} visible={visible}>
        <motion.div className={styles.backdrop} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="id"
            className={styles.anim}
            ref={ref}
            initial={{ opacity: 0, y: 'calc(-50% + 50px)', x: '-50%' }}
            animate={{ opacity: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, y: 'calc(-50% - 50px)', x: '-50%' }}
            transition={{ duration: 0.3 }}
          >
            <Card
              type={type}
              border={border}
              className={styles.card}
              {...props}
            >
              <button className={styles.close} onClick={closeModal}>
                <Exit />
              </button>
              {children}
            </Card>
          </motion.div>
        </motion.div>
      </Modal>
    </AnimatePresence>
  );
};