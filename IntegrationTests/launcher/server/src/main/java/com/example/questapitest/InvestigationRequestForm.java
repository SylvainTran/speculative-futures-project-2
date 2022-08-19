package com.example.questapitest;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class InvestigationRequestForm {

    ValidFormRequest validFormRequest;
    String keywordsConcat = "";
    String validRequestResponse = "";

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
            Path currentRelativePath = Paths.get("");
            String pathPrefix = currentRelativePath.toAbsolutePath().toString();
            String dataPathPrefix = "/data/";
            Path of = Path.of(pathPrefix + dataPathPrefix + "InvestigationFormsData.json");

            JsonNode jsonNode = mapper.readTree(of.toFile());
            jsonNode.forEach(node -> System.out.println((node)));

            ArrayList<ValidFormRequest> listRequests = mapper.readValue(of.toFile(), new TypeReference<ArrayList<ValidFormRequest>>(){});

            // Find entry in list with request type and keywords
            listRequests.forEach(request -> {
                // The requestType and the keywords are matched only for equality
                if (request.equals(validFormRequest)) {
                    validRequestResponse = request.getResponse();
                }
            });
            System.out.println("Valid request response: " + validRequestResponse);
            return "{ \"response\": " + "\"" + validRequestResponse + "\"" + " }";

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }
}
