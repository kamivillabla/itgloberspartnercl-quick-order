import React, { useState, useEffect } from 'react'
import { useMutation, useLazyQuery } from 'react-apollo'
import UPDATE_CART from '../graphql/updateCart.graphql'
import GET_PRODUCT from '../graphql/getProductBySku.graphql'
import { useCssHandles } from 'vtex.css-handles'

import './styles.css'

const QuickOrder = () => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("")

  const CSS_HANDLES = [
    "quickOrder__container",
    "quickOrder__title",
    "quickOrder__form",
    "quickOrder__container--label",
    "quickOrder__label",
    "quickOrder__input",
    "quickOrder__container--inputAndBtn",
    "quickOrder__btn-submit",

  ]
  const handles = useCssHandles(CSS_HANDLES)

  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)

  const handleChange = (event: any) => {
    setInputText(event.target.value)
    console.log("Input changed", inputText);
  }

  useEffect(() => {
    console.log("el resultado producto es", product, search);
    if (product) {
      let skuId = parseInt(inputText)
      addToCart({
        variables: {
          salesChannel: "1",
          items: [
            {
              id: skuId,
              quantity: 1,
              seller: "1"
            }
          ]
        }
      })
        .then(() => {
          window.location.href = "/checkout"
        })
    }
  }, [product, search])


  const addProductToCart = () => {
    getProductData({
      variables: {
        sku: inputText
      }
    })
  }

  const searchProduct = (event: any) => {
    event.preventDefault();
    if (!inputText) {
      alert("se ingreso algo")
    } else {
      setSearch(inputText)
      addProductToCart()
    }
  }

  return (
    <div className={handles["quickOrder__container"]}>
      <h2 className={handles["quickOrder__title"]}>Compra rápida en ACERSTORE</h2>
      <form className={handles["quickOrder__form"]} onSubmit={searchProduct}>
        <div className={handles["quickOrder__container--label"]}>
          <label className={handles["quickOrder__label"]} htmlFor="sku">Ingresa el número de SKU</label>

        </div>
        <div className={handles["quickOrder__container--inputAndBtn"]}>
          <input className={handles["quickOrder__input"]} placeholder="Busca por sku" id="sku" type="text" onChange={handleChange} />
          <input className={handles["quickOrder__btn-submit"]} type="submit" value={"Añadir al carrito"} />
        </div>
      </form>
    </div>
  )
}

export default QuickOrder
