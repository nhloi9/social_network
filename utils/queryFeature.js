class queryFeature {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	pagination() {
		const page = this.queryString.page || 1;
		const limit = this.queryString.limit || 6;
		this.query = this.query.skip((page - 1) * limit).limit(limit);
		return this.query;
	}
}
module.exports = {queryFeature};
