package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ClientUpdateTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClientUpdate.class);
        ClientUpdate clientUpdate1 = new ClientUpdate();
        clientUpdate1.setId(1L);
        ClientUpdate clientUpdate2 = new ClientUpdate();
        clientUpdate2.setId(clientUpdate1.getId());
        assertThat(clientUpdate1).isEqualTo(clientUpdate2);
        clientUpdate2.setId(2L);
        assertThat(clientUpdate1).isNotEqualTo(clientUpdate2);
        clientUpdate1.setId(null);
        assertThat(clientUpdate1).isNotEqualTo(clientUpdate2);
    }
}
