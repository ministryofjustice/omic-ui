import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import DatePicker from './datePicker'

const DatePickerInput = (props) => {
  const { additionalClassName, handleDateChange } = props

  return (
    <DatePicker
      inputProps={{ className: `datePickerInput form-control ${additionalClassName}` }}
      name="date"
      shouldShowDay={(date) => !date.isBefore(moment().add(1, 'days').startOf('day'))}
      title="Date"
      handleDateChange={handleDateChange}
      {...props}
    />
  )
}

DatePickerInput.propTypes = {
  additionalClassName: PropTypes.string.isRequired,
  handleDateChange: PropTypes.func.isRequired,
}
export default DatePickerInput
