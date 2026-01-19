export const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildSearchFilter = (search, fields) => {
  if (!search) {
    return {};
  }

  const regex = new RegExp(search, 'i');
  return {
    $or: fields.map((field) => ({ [field]: regex }))
  };
};
