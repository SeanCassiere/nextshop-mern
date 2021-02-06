import React from "react"
import { Helmet } from "react-helmet"

const MetaDecorator = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

MetaDecorator.defaultProps = {
  title: "Welcome to NextShop",
  description: "The NextShop one-stop shopping spot",
  keywords: "electronics, buy electronics, cheap electronics",
}

export default MetaDecorator
