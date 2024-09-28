def _format_one(item):
    '''Format a single mongo_item to JSON Format'''
    if item["_id"]:
        item["_id"] = str(item["_id"])
    return item

def format(data):
    '''Format a list of mongo_items to JSON, if data is not a list, format a single item'''
    if (not isinstance(data, list)):
        return _format_one(data)
    temp = []
    for item in data:
        temp.append(_format_one(item))
    return temp