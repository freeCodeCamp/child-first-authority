import React, {PropTypes} from 'react';
import DataTable from '../common/data-table/DataTable';

const HomeTab = ({view, schools}) => {
  const columnDefs = [{
    title : 'Name',
    id    : 'name',
    flexGrow : 1
  }, {
    title    : 'Actions',
    id       : 'action',
    width : 100
  }];

  const tableProps = {
    table : {
      width  : view.width,
      height : view.height,
    },
    rowHeight    : 50,
    headerHeight : 50
  };

  return (
    <DataTable
      table={tableProps}
      column={columnDefs}
      data={schools}
    />
  );
};

HomeTab.propTypes = {
  view    : PropTypes.object.isRequired,
  schools : PropTypes.array.isRequired,
};

export default HomeTab;

