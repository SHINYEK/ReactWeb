
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const BoxModal = ({ box, setBox }) => {
    const onClose = () => {
        setBox({
            ...box,
            show: false
        })
    }

    const onAction = () => {
        box.action();
        onClose();
    }

    return (
        <>
            <Modal
                show={box.show}
                onHide={onClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>알림</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {box.message}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        {box.action ? "취소" : "닫기"}
                    </Button>
                    {box.action && <Button variant="primary" onClick={onAction}>확인</Button>}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default BoxModal