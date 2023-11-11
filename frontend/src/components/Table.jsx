import React from 'react'
import { Table as RTable } from 'react-bootstrap'
import { useSortBy, useTable } from 'react-table'

import '../styles/table.module.css'

function Table({ columns, data, initialState }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
    initialState
  }, useSortBy)

  return (
    // apply the table props
    <RTable className='table' hover bordered variant="dark" {...getTableProps()}>
      <thead>
        {// Loop over the header rows
          headerGroups.map(headerGroup => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {// Loop over the headers in each row
                headerGroup.headers.map(column => (
                  // Apply the header cell props
                  <th {...column.getHeaderProps([
                    {
                      className: column.className
                    }
                  ])}>
                    {// Render the header
                      column.render('Header')}
                  </th>
                ))}
            </tr>
          ))}
      </thead>
      {/* Apply the table body props */}
      <tbody>
        {// Loop over the table rows
          rows.map((row, i) => {
            // Prepare the row for display
            prepareRow(row)
            return (
              // Apply the row props
              <tr {...row.getRowProps()}>
                {// Loop over the rows cells
                  row.cells.map(cell => {
                    // Apply the cell props
                    if (cell.value) {
                      return (
                        <td variant='auto' {...cell.getCellProps()} style={cell.column.style} className={cell.column.className}>
                          {// Render the cell contents
                            cell.render('Cell')}
                        </td>
                      )
                    } else {
                      return (
                        <td variant='auto' {...cell.getCellProps()}>
                          {// Render the cell contents
                            cell.render('Cell')}
                        </td>
                      )
                    }

                  })}
              </tr>
            )
          })}
      </tbody>
    </RTable >
  )
}

export default Table