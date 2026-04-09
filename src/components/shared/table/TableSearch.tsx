import { Input } from "antd";
import { useState, useEffect } from "react";
import Proptypes from "prop-types";

const TableSearch = ({ setQuery, placeholder = "Search...", size = "" }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: value, page: 1 })); // reset page on new search
    }, 500); // debounce 500ms

    return () => clearTimeout(delayDebounce);
  }, [value, setQuery]);

  return (
    <Input
      size={size as "small" | "middle" | "large"}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      allowClear
      className="w-full"
    />
  );
};

export default TableSearch;

TableSearch.propTypes = {
  setQuery: Proptypes.func,
  placeholder: Proptypes.string,
};
