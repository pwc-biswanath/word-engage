import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Card, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

const VendorSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  number: Yup.string().required('Contact Number is required'),
})

const Registration = () => {
  let history = useNavigate()

  const saveData = (value: any) => {
    history('/question')
  }

  return (
    <>
      <Grid style={{ marginTop: 20 }} container>
        <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Card>
            <Typography
              style={{ marginLeft: '15px', marginTop: '10px', padding: 3 }}
              component="h1"
              variant="h5"
            >
              User Registration
            </Typography>
            <div
              className="p-8 h-full"
              style={{ justifyContent: 'center', padding: '20px' }}
            >
              <Formik
                initialValues={{
                  name: '',
                  number: '',
                }}
                validationSchema={VendorSchema}
                onSubmit={(values, { setSubmitting }) => {
                  saveData(values)
                  setSubmitting(false)
                }}
              >
                {({ touched, errors, isSubmitting }) => (
                  <Form>
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <Field
                        type="text"
                        name="name"
                        autoComplete="flase"
                        placeholder="Enter full name"
                        className={`form-control text-muted ${
                          touched.name && errors.name ? 'is-invalid' : ''
                        }`}
                      />

                      <ErrorMessage
                        component="div"
                        name="name"
                        className="invalid-feedback"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="name">Contact No</label>
                      <Field
                        type="number"
                        name="number"
                        autoComplete="flase"
                        placeholder="Enter contact number"
                        className={`form-control text-muted ${
                          touched.number && errors.number ? 'is-invalid' : ''
                        }`}
                      />

                      <ErrorMessage
                        component="div"
                        name="number"
                        className="invalid-feedback"
                      />
                    </div>

                    <span className="input-group-btn">
                      <input
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        type="submit"
                        value={'Sign up'}
                        style={{ marginTop: 20, color: 'black' }}
                      />
                    </span>
                  </Form>
                )}
              </Formik>
            </div>
          </Card>
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
      </Grid>
    </>
  )
}
export default Registration
