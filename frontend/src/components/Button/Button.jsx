import React from 'react'

const ButtonPrimary = (props) => (
<button onClick={() => props.onClick()} disabled={props.disabled} className={`button -primary ${ props.customClass }`}> { props.title } </button>
)

const ButtonSubmit = (props) => (
  <button disabled={props.disabled} className={`button -primary ${props.customClass}`} type="submit"> {props.title} </button>
)

const ButtonSecondary = (props) => (
  <button onClick={() => props.onClick()} disabled={props.disabled} className={`button -secondary ${ props.customClass }` }> { props.title } </button>
  )

const ButtonOutline = (props) => (
  <button onClick={() => props.onClick()} disabled={props.disabled} className={`button -outline ${ props.customClass }` }> { props.title } </button>
)

const ButtonText = (props) => (
  <button onClick={() => props.onClick()} disabled={props.disabled} className={`button -text ${ props.customClass }` }> <i className={`${ props.icon }`}></i> { props.title } </button>
)

const ButtonIcon = (props) => (
  <button onClick={() => props.onClick()} disabled={props.disabled} className={`button -fabtn ${ props.customClass }`}> <i className={`mr-10 ${props.faicon} `}></i>{ props.title } </button>
  )

export {
  ButtonPrimary,
  ButtonOutline,
  ButtonSecondary,
  ButtonText,
  ButtonIcon,
  ButtonSubmit
}