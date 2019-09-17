import React, { useRef } from 'react'
import styled, { css } from 'react-emotion';
import { REGEX } from '../../helpers'
import { ProviderProps } from '../ProviderTypes'

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

  const pin1 = useRef<HTMLInputElement>(null)
  const pin2 = useRef<HTMLInputElement>(null)
  const pin3 = useRef<HTMLInputElement>(null)
  const pin4 = useRef<HTMLInputElement>(null)

  const checkPinIsValid = () => {
    if (pin4.current !== null && pin3.current !== null && pin2.current !== null && pin1.current !== null) {
      const isPinValid = !REGEX.NULL_WHITESPACE.test(pin1.current.value)
        && !REGEX.NULL_WHITESPACE.test(pin2.current.value)
        && !REGEX.NULL_WHITESPACE.test(pin3.current.value)
        && !REGEX.NULL_WHITESPACE.test(pin4.current.value)

      if (isPinValid) {
        const pin = `${pin1.current.value}${pin2.current.value}${pin3.current.value}${pin4.current.value}`
        console.log(pin)
        props.onPinValid({ pin , appname : 'My Dapp'})
      }
    }
  }

  const updateField = (e: any) => {
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
    checkPinIsValid()

  }

  return (
    <div>
      <Column>
        <Row>
          <input className={TextInput} type='password' maxLength={1}
            name='pin1' ref={pin1}
            onChange={updateField} />
          <input className={TextInput} maxLength={1} type='password'
            name='pin2' ref={pin2}
            onChange={updateField} />
          <input className={TextInput} maxLength={1} type='password'
            name='pin3' ref={pin3}
            onChange={updateField} />
          <input className={TextInput} maxLength={1} type='password'
            name='pin4' ref={pin4}
            onChange={updateField} />
        </Row>
      </Column>
    </div>
  )
}

export default PinCreationScreen

