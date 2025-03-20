package com.skycast.location_service.model;

import java.util.List;

public class GeoNamesResponse {
    private List<GeoName> geonames;

    public List<GeoName> getGeonames() {
        return geonames;
    }

    public void setGeonames(List<GeoName> geonames) {
        this.geonames = geonames;
    }
}
