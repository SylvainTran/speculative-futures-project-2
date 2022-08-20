package com.example.questapitest;

import java.util.ArrayList;

public class ValidFormRequest {
 
    private String name;
    private int id;
    private String requestType;
    private ArrayList<String> keywords;
    private String response;
    private String keywordsConcat = "";
    private String responseKey = "";

    public ValidFormRequest() {}

    public ValidFormRequest(String name, int id, String requestType, ArrayList<String> keywords, String response) {
        this.name = name;
        this.id = id;
        this.requestType = requestType;
        this.keywords = keywords;
        this.response = response;
    }

    public ValidFormRequest(String requestType, ArrayList<String> keywords, String keywordsConcat) {
        this.requestType = requestType;
        this.keywords = keywords;
        this.keywordsConcat = keywordsConcat;

        // This is placeholder - this class only encapsulates the request
        this.name = "chapter1";
        this.id = 0;
        this.response = "Neptunia is a rumored location on Titan";
    }

    public String getName() {
        return this.name;
    }

    public int getId() {
        return this.id;
    }

    public String getRequestType() {
        return this.requestType;
    }

    public String getResponse() {
        return this.response;
    }

    public ArrayList<String> getKeywords() {
        return this.keywords;
    }

    public String getKeywordsConcat() {
        return this.keywordsConcat;
    }

    public String getResponseKey() {
        return responseKey;
    }

    public void setResponseKey(String responseKey) {
        this.responseKey = responseKey;
    }

    @Override
    public String toString() {
        return "Request Type: " + this.requestType + "\n" + keywordsConcat;
    }

    @Override
    public boolean equals(Object other) {
        if (other.getClass() != this.getClass()) {
            return false;
        }
        ValidFormRequest requestCasted = (ValidFormRequest) other;
        boolean typecheck =  requestCasted.getRequestType().equals(requestType);
        boolean keywordscheck =  requestCasted.getKeywordsConcat().equals(keywordsConcat);
        return typecheck && keywordscheck;
    }
}
