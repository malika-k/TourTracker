def filterData(newurl):
        import json
        import urllib.request
        response = urllib.request.urlopen(newurl)
        content = response.read().decode()
        pycontent = json.loads(content)
        parentarray = []
        for dictobj in pycontent:
                ven = dictobj["venue"]
                if "city" not in ven:
                        ven["city"] = ""
                if "region" not in ven:
                        ven["region"] = ""
                if "country" not in ven:
                        ven["country"] = ""
                if ("latitude" in ven) and ("longitude" in ven):
                        babyarray = []
                        babyarray.append(ven["name"])
                        babyarray.append(ven["city"])
                        babyarray.append(ven["region"])
                        babyarray.append(float(ven["latitude"]))
                        babyarray.append(float(ven["longitude"]))
                        babyarray.append(ven["country"])
                        parentarray.append(babyarray)
        return json.dumps(parentarray)