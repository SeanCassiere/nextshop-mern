import React, { useEffect } from "react"
import { LinkContainer } from "react-router-bootstrap"
import { Table, Button, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"

import Message from "../components/Message"
import Loader from "../components/Loader"
import Paginate from "../components/Paginate"
import MetaDecorator from "../components/MetaDecorator"

import {
  listAllProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions"

import { PRODUCT_CREATE_RESET } from "../constants/productConstants"

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productListAll = useSelector((state) => state.productListAll)
  const { loading, error, products, page, pages } = productListAll

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
  } = productDelete

  const productCreate = useSelector((state) => state.productCreate)
  const {
    loading: createLoading,
    error: createError,
    success: createSuccess,
    product: createdProduct,
  } = productCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })

    if (userInfo && userInfo.isAdmin) {
      dispatch(listAllProducts("", pageNumber))
    } else {
      history.push("/login")
    }
    if (createSuccess) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
    }
  }, [
    dispatch,
    history,
    userInfo,
    deleteSuccess,
    createSuccess,
    createdProduct,
    pageNumber,
  ])

  const createProductHandler = (product) => {
    dispatch(createProduct())
  }

  const deleteHandler = (id) => {
    // Delete Product
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id))
    }
  }

  return (
    <>
      <MetaDecorator title='Admin - All Products' />
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i>&nbsp;Create Product
          </Button>
        </Col>
      </Row>
      {(loading || deleteLoading || createLoading) && <Loader />}
      {deleteError && <Message variant='danger'>{deleteError}</Message>}
      {createError && <Message variant='danger'>{createError}</Message>}
      {loading ? (
        ""
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <td>Active</td>
                <th>Category</th>
                <th>Brand</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td className='text-center'>
                    {product.isActive ? (
                      <i
                        className='fas fa-check'
                        style={{ color: "green" }}
                      ></i>
                    ) : (
                      <i className='fas fa-times' style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => {
                        deleteHandler(product._id)
                      }}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  )
}

export default ProductListScreen
