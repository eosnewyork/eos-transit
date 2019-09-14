import React, {useState, useRef } from 'react'
import styled, { css } from 'react-emotion';
import { GoButton } from '../../buttons/GoButton'
import {REGEX} from '../../helpers'
import {ProviderProps} from '../ProviderTypes'

const Column = styled('div')({
    textAlign: 'center',
  })
  
  const Row = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: 100
  })

  const TextInput = css`width: 40px; height: 40px; margin:5px; background-color:#E9F5F7; padding:10px;font-size:1rem'`


export const PinCreationScreen: React.FC<ProviderProps> = (props) => {

  const pin1 = useRef<any>(null)
  const pin2 = useRef<any>(null)
  const pin3 = useRef<any>(null)
  const pin4 = useRef<any>(null)

  const [pins, setValues] = useState({
    pin1: '',
    pin2: '',
    pin3: '',
    pin4: ''
  })

  const onSetPin = () => {
    const pin = `${pins.pin1}${pins.pin2}${pins.pin3}${pins.pin4}`
    const { onSelect } = props;
    if (typeof onSelect === 'function') {
      onSelect({pin});
    }
  }

  const updateField = (e: any) => {
    setValues({
      ...pins,
      [e.target.name]: e.target.value
    })

    if (e.target.value.length > 0) {
      switch (e.target.name) {
      case 'pin1': {
        if (pin2.current !== null) {
          pin2.current.focus()
        }
        break
      }
      case 'pin2': {
        if (pin3.current !== null) {
          pin3.current.focus()
        }
        break
      }
      case 'pin3': {
        if (pin4.current !== null) {
          pin4.current.focus()
        }
        break
      }
      default: {
      break
      }
    }
    }
  }

  const renderButton = () => {
    if (!REGEX.NULL_WHITESPACE.test(pins.pin1)
      && !REGEX.NULL_WHITESPACE.test(pins.pin2)
      && !REGEX.NULL_WHITESPACE.test(pins.pin3)
      && !REGEX.NULL_WHITESPACE.test(pins.pin4)) {
      return <GoButton onClick={() => onSetPin()} ><>Go</></GoButton>
    } else {
      return <GoButton disabled={true} style = {{background: '#bbb'}} ><>Go</></GoButton>
    }
  }

  return (
  <div>
    <Column>
      <Row>
        <input className={TextInput} type='text' maxLength={1}  value={pins.pin1}
          name='pin1' ref={pin1} 
          onChange={updateField} />
        <input className={TextInput} maxLength={1} value={pins.pin2}
          name='pin2' ref= {pin2}
          onChange={updateField}/>
        <input className={TextInput}  maxLength={1} value={pins.pin3}
          name='pin3' ref= {pin3}
          onChange={updateField}/>
        <input className={TextInput} maxLength={1} value={pins.pin4}
          name='pin4' ref= {pin4}
          onChange={updateField}/>
      </Row>
      <Row>
      {renderButton()}
      </Row>
    </Column>  
  </div>
  )
}

export default PinCreationScreen

