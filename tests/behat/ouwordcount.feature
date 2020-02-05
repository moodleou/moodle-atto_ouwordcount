@ou @ouvle @editor @editor_atto @atto @atto_ouwordcount @javascript
Feature: Atto word count

  Background:
    Given the following "courses" exist:
      | fullname | shortname | category |
      | Course 1 | C1        | 0        |
    And I log in as "admin"
    And I follow "Preferences" in the user menu
    And I follow "Editor preferences"
    And I set the field "Text editor" to "Atto HTML editor"
    And I press "Save changes"
    And I set the following administration settings values:
      | Toolbar config | insert = ouwordcount |
    And I am on site homepage

  Scenario: Loading ouwordcount with capability
    Given the following "roles" exist:
      | name       | shortname | description          | archetype |
      | Word Exile | nowords   | Can't see word count |           |
    And the following "users" exist:
      | username | firstname | lastname | email              |
      | exile1   | exile     | 1        | exile1@example.com |
    And the following "course enrolments" exist:
      | user   | course | role    |
      | exile1 | C1     | nowords |
    And I follow "Preferences" in the user menu
    And I follow "Edit profile"
    When I click on "#id_description_editoreditable" "css_element"
    Then I should see "Word count: 0"
    And I am on homepage
    And I log out
    When I log in as "exile1"
    And I follow "Preferences" in the user menu
    And I follow "Edit profile"
    When I click on "#id_description_editoreditable" "css_element"
    Then I should not see "Word count: 0"

  Scenario: Counting words
    Given I open my profile in edit mode
    Then I should not see "Word count:"
    When I click on "#id_description_editoreditable" "css_element"
    Then I should see "Word count: 0"
    When I set the field "Description" to "Hello, Es mīlu tevi, Hallo., Salâm, Olá, Sàwàtdee kráp, Kónnichi wa, 您好, สวัสดี ..."
    And I click on ".editor_atto_toolbar" "css_element"
    And I click on "#id_description_editoreditable" "css_element"
    Then I should see "Word count: 14"

  Scenario: Counting words on multiple lines
    Given I open my profile in edit mode
    When I set the field "Description" to multiline:
    """
    <p>One</p><p>two</p><p>three<br/>four</p>
    """
    And I click on "#id_description_editoreditable" "css_element"
    Then I should see "Word count: 4"