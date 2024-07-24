import { FC } from 'react'
import { Modal, InputNumber, Button } from 'antd'
type propsC = {
  isModalOpen: boolean
  wModal: {
    value: number
    onChange(val: number | null): void
  }
  hModal: {
    value: number
    onChange(val: number | null): void
  }
  generateImg(): void
  loading: boolean
  setIsModalOpen(args: boolean): void
}
const ModalCust: FC<propsC> = ({
  isModalOpen = true,
  hModal,
  wModal,
  generateImg,
  loading,
  setIsModalOpen
}): JSX.Element => {
  return (
    <Modal
      open={isModalOpen}
      centered={true}
      width={300}
      closable={false}
      footer={null}
      onCancel={() => setIsModalOpen(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <InputNumber
          size={'small'}
          {...wModal}
          min={10}
          max={5000}
          placeholder="宽"
          controls={false}
        />
        <InputNumber
          size="small"
          {...hModal}
          min={10}
          max={5000}
          placeholder="高"
          controls={false}
        />
        <Button size="small" type="primary" onClick={generateImg} loading={loading}>
          生成
        </Button>
      </div>
    </Modal>
  )
}

export default ModalCust
