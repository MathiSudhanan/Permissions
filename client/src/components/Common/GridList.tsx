import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React from "react";

const GridList = ({ columns, rows, visibleFields, onRowDoubelClick }) => {
  const data = {
    columns: columns,
    rows: rows,
    visibleFields: visibleFields,
  };

  const filterColumns = React.useMemo(
    () => data.columns.filter((column) => visibleFields.includes(column.field)),
    [data.columns]
  );
  return (
    <>
      <DataGrid
        {...data}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        columns={filterColumns}
        components={{ Toolbar: GridToolbar }}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={5}
        pagination
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        onRowDoubleClick={onRowDoubelClick}
      />
    </>
  );
};

export default GridList;
