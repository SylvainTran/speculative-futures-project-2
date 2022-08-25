package com.example.questapitest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Map;

public class InvestigationRequestForm {

    ValidFormRequest validFormRequest;
    String keywordsConcat = "";
    String validRequestResponse = "";
    String validRequestResponseKey = "";

    public InvestigationRequestForm(String requestType, ArrayList<String> keywords) {
        keywords.forEach(keyword -> keywordsConcat += (keyword.trim().toLowerCase()));
        validFormRequest = new ValidFormRequest(requestType, keywords, keywordsConcat);
    }

    public ValidFormRequest getValidFormRequest() {
        return validFormRequest;
    }

    @Override
    public String toString() {
        return "Request Type: " + validFormRequest.getRequestType() + "\n" + keywordsConcat;
    }

    public String getData() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String dataPathPrefix = "data/";
            Path of = Path.of(dataPathPrefix + "InvestigationFormsData.json");

            JsonNode jsonNode = mapper.readTree(of.toFile());
            jsonNode.forEach(node -> System.out.println((node)));

            //ArrayList<ValidFormRequest> listRequests = mapper.readValue(of.toFile(), new TypeReference<ArrayList<ValidFormRequest>>(){});
            Map<String, ValidFormRequest[]> listRequests = mapper.readValue(of.toFile(), new TypeReference<Map<String, ValidFormRequest[]>>(){});        	
            ValidFormRequest[] arr = listRequests.get(validFormRequest.getRequestType());

            for (int i = 0; i < arr.length; i++) {
                if (arr[i].equals(validFormRequest)) {
                    System.out.println("Found: " + arr[i]);
                    validRequestResponse = arr[i].getResponse();
                    validRequestResponseKey = arr[i].getResponseKey();
                }
            }
            System.out.println("Valid request response: " + validRequestResponse);
            ObjectNode responseObject = mapper.createObjectNode();
            responseObject.put("response", validRequestResponse);
            responseObject.put("eventKey", validRequestResponseKey);
            String jsonResponse = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(responseObject);
            System.out.println(jsonResponse);
            return jsonResponse;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }
}
